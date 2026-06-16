import { NextRequest, NextResponse } from "next/server";
import { checkAdminSession } from "@/app/actions";

export async function POST(request: NextRequest) {
  // 1. Verify administrative credentials
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file detected in upload." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    // 2. Fallback to Base64 Data URI if ImageKit credentials are not configured
    if (!publicKey || !privateKey || !urlEndpoint) {
      const base64 = buffer.toString("base64");
      const mimeType = file.type || "image/jpeg";
      const dataUri = `data:${mimeType};base64,${base64}`;
      return NextResponse.json({
        url: dataUri,
        fileId: null,
        message: "Uploaded locally via Base64 conversion (ImageKit keys missing)."
      });
    }

    // 3. Upload to ImageKit.io via REST API
    const uploadForm = new FormData();
    const blob = new Blob([buffer], { type: file.type });
    uploadForm.append("file", blob, file.name);
    uploadForm.append("fileName", file.name);
    
    // Auth header is base64 encoded private key + colon
    const authHeader = Buffer.from(`${privateKey}:`).toString("base64");

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
      },
      body: uploadForm,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`ImageKit API error: ${errText}`);
    }

    const data = await response.json();
    console.log("[ImageKit Upload] Response keys:", Object.keys(data), "fileId:", data.fileId, "filePath:", data.filePath);
    return NextResponse.json({ url: data.url, fileId: data.fileId, filePath: data.filePath });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process image upload." },
      { status: 500 }
    );
  }
}
