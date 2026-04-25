package com.valdivia.art.service;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageUploadConversionService {

  private static final float JPEG_QUALITY = 0.85f;

  public byte[] convertAndCompress(MultipartFile file) throws IOException {
    BufferedImage image = ImageIO.read(file.getInputStream());

    if (image == null) {
      throw new IOException("Could not read image file. Unsupported or corrupt format.");
    }

    // Flatten alpha channel if present (PNG transparency -> white background)
    if (image.getColorModel().hasAlpha()) {
      image = flattenAlpha(image);
    }

    return encodeAsJpeg(image);
  }

  private BufferedImage flattenAlpha(BufferedImage image) {
    BufferedImage flattened = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
    Graphics2D g2d = flattened.createGraphics();
    g2d.setColor(Color.WHITE);
    g2d.fillRect(0, 0, image.getWidth(), image.getHeight());
    g2d.drawImage(image, 0, 0, null);
    g2d.dispose();
    return flattened;
  }

  private byte[] encodeAsJpeg(BufferedImage image) throws IOException {
    ImageWriter writer = ImageIO.getImageWritersByFormatName("jpeg").next();
    ImageWriteParam writeParam = writer.getDefaultWriteParam();
    writeParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
    writeParam.setCompressionQuality(JPEG_QUALITY);

    try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
      writer.setOutput(ImageIO.createImageOutputStream(baos));
      writer.write(null, new IIOImage(image, null, null), writeParam);
      writer.dispose();
      return baos.toByteArray();
    }
  }
}
