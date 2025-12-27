import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export const runtime = "nodejs";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;

        // Validate filename to prevent directory traversal
        if (filename.includes("..") || filename.includes("/")) {
            return NextResponse.json(
                { error: "Invalid filename" },
                { status: 400 }
            );
        }

        // Construct file path
        const uploadsDir =
            process.env.UPLOADS_DIR || path.join(process.cwd(), "public", "uploads");
        const filepath = path.join(uploadsDir, filename);

        // Check if file exists
        if (!existsSync(filepath)) {
            console.error("File not found:", {
                filename,
                uploadsDir,
                filepath,
                cwd: process.cwd(),
            });
            return NextResponse.json(
                { 
                    error: "File not found",
                    details: { filename, uploadsDir, filepath }
                },
                { status: 404 }
            );
        }

        // Read file
        const fileBuffer = await readFile(filepath);

        // Determine content type based on file extension
        const ext = path.extname(filename).toLowerCase();
        const contentTypeMap: Record<string, string> = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
            ".svg": "image/svg+xml",
        };
        const contentType = contentTypeMap[ext] || "application/octet-stream";

        // Return file with appropriate headers
        return new NextResponse(new Uint8Array(fileBuffer), {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Error serving file:", {
            error,
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json(
            { 
                error: "Failed to serve file",
                message: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
