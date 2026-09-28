import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file foto yang diunggah' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const fileExtension = path.extname(file.name) || '.jpg';
    const filename = `sampah_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${fileExtension}`;

    // Target upload directory: public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const fotoUrl = `/uploads/${filename}`;
    return NextResponse.json({ message: 'Foto berhasil diunggah', fotoUrl });
  } catch (error) {
    console.error('Upload photo error:', error);
    return NextResponse.json({ error: 'Gagal mengunggah foto sampah' }, { status: 500 });
  }
}
