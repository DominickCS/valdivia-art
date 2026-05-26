package com.valdivia.art.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.valdivia.art.dto.request.ContactRequest;
import com.valdivia.art.entity.Artwork;
import com.valdivia.art.entity.Order;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

  private final JavaMailSender mailSender;

  // ── Helpers
  // ───────────────────────────────────────────────────────────────────

  // "Title A" for single-artwork orders, "Title A, Title B & Title C" for multi
  private String artworkSubjectLabel(Order order) {
    List<Artwork> artworks = order.getArtworks();
    if (artworks.isEmpty())
      return "Your order";
    if (artworks.size() == 1)
      return artworks.get(0).getTitle();
    String allButLast = artworks.subList(0, artworks.size() - 1).stream()
        .map(Artwork::getTitle)
        .collect(Collectors.joining(", "));
    return allButLast + " & " + artworks.get(artworks.size() - 1).getTitle();
  }

  // Builds a stacked table row per artwork for use in order/shipping emails
  private String buildArtworkRows(List<Artwork> artworks) {
    StringBuilder sb = new StringBuilder();
    for (Artwork a : artworks) {
      sb.append("""
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #f0ede8;">
              <table width="100%%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:56px;vertical-align:top;">
                    <img src="%s" alt="%s"
                         width="56" height="56"
                         style="display:block;object-fit:cover;border:1px solid #e0ddd6;"/>
                  </td>
                  <td style="padding-left:12px;vertical-align:middle;font-size:13px;color:#1a1a1a;font-style:italic;">
                    %s
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          """.formatted(a.getImageURL(), a.getTitle(), a.getTitle()));
    }
    return sb.toString();
  }

  // ── Welcome
  // ───────────────────────────────────────────────────────────────────

  public void sendWelcomeEmail(String mailRecipient, String fullName) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setFrom("mail@dominickcs.com");
      helper.setTo(mailRecipient);
      helper.setSubject("Welcome to Valdivia Art!");
      helper.setText(buildWelcomeEmailHtml(fullName), true);

      mailSender.send(message);
    } catch (MessagingException e) {
      System.out.println("Failed to send welcome email to " + mailRecipient + " " + e.getMessage());
    }
  }

  private String buildWelcomeEmailHtml(String fullName) {
    return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Welcome</title>
        </head>
        <body style="margin:0;padding:0;background:#f5f5f0;font-family:Georgia,serif;">

          <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0"
                       style="background:#ffffff;border:1px solid #e0ddd6;max-width:560px;width:100%%;">

                  <!-- Header -->
                  <tr>
                    <td style="padding:40px 48px 32px;border-bottom:1px solid #e0ddd6;text-align:center;">
                      <p style="margin:0 0 8px;font-size:11px;letter-spacing:4px;color:#999;text-transform:uppercase;">
                        Valdivia Art
                      </p>
                      <h1 style="margin:0;font-size:26px;font-weight:normal;color:#1a1a1a;letter-spacing:1px;">
                        Welcome
                      </h1>
                    </td>
                  </tr>

                  <!-- Greeting -->
                  <tr>
                    <td style="padding:36px 48px 0;">
                      <p style="margin:0;font-size:15px;color:#444;line-height:1.7;">
                        Thank you for creating an account, %s. You now have access to the
                        full Valdivia Art collection and can purchase original works directly
                        through the site.
                      </p>
                    </td>
                  </tr>

                  <!-- What's next -->
                  <tr>
                    <td style="padding:28px 48px;">
                      <table width="100%%" cellpadding="0" cellspacing="0"
                             style="border:1px solid #e0ddd6;">
                        <tr>
                          <td style="padding:24px;border-bottom:1px solid #e0ddd6;">
                            <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;color:#999;text-transform:uppercase;">
                              What's next
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:20px 24px;">
                            <table width="100%%" cellpadding="0" cellspacing="0"
                                   style="font-size:13px;color:#444;line-height:2;">
                              <tr>
                                <td style="padding:6px 0;border-bottom:1px solid #f0ede8;">
                                  <span style="color:#999;letter-spacing:1px;text-transform:uppercase;font-size:11px;">01 &nbsp;</span>
                                  Browse the collection and explore available works
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:6px 0;border-bottom:1px solid #f0ede8;">
                                  <span style="color:#999;letter-spacing:1px;text-transform:uppercase;font-size:11px;">02 &nbsp;</span>
                                  Purchase directly — no intermediaries, straight from the artist
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:6px 0;">
                                  <span style="color:#999;letter-spacing:1px;text-transform:uppercase;font-size:11px;">03 &nbsp;</span>
                                  Track your orders from your site profile
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:0 48px 40px;text-align:center;">
                      <p style="margin:0;font-size:12px;color:#aaa;line-height:1.8;">
                        Questions? Reply to this email anytime.<br/>
                        &copy; %d Valdivia.co All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>

        </body>
        </html>
        """
        .formatted(fullName, java.time.LocalDate.now().getYear());
  }

  // ── Order invoice
  // ─────────────────────────────────────────────────────────────

  public void sendOrderInvoice(String mailRecipient, Order order) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setFrom("mail@dominickcs.com");
      helper.setTo(mailRecipient);
      helper.setSubject("Order Confirmed – " + artworkSubjectLabel(order));
      helper.setText(buildOrderEmailHtml(order), true);

      mailSender.send(message);
    } catch (MessagingException e) {
      System.out.println("Failed to send order invoice to " + mailRecipient + " " + e.getMessage());
    }
  }

  private String buildOrderEmailHtml(Order order) {
    String formattedAmount = String.format("$%.2f", order.getAmountTotal() / 100.0);
    String shippingAddress = String.join(", ",
        order.getShippingLine1(),
        order.getShippingLine2() != null ? order.getShippingLine2() : "",
        order.getShippingCity(),
        order.getShippingState(),
        order.getShippingPostalCode(),
        order.getShippingCountry()).replace(", ,", ",").trim();

    String artworkRows = buildArtworkRows(order.getArtworks());
    int itemCount = order.getArtworks().size();
    String itemLabel = itemCount == 1 ? "1 item" : itemCount + " items";

    return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Order Confirmed</title>
        </head>
        <body style="margin:0;padding:0;background:#f5f5f0;font-family:Georgia,serif;">

          <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0"
                       style="background:#ffffff;border:1px solid #e0ddd6;max-width:560px;width:100%%;">

                  <!-- Header -->
                  <tr>
                    <td style="padding:40px 48px 32px;border-bottom:1px solid #e0ddd6;text-align:center;">
                      <p style="margin:0 0 8px;font-size:11px;letter-spacing:4px;color:#999;text-transform:uppercase;">
                        Valdivia Art
                      </p>
                      <h1 style="margin:0;font-size:26px;font-weight:normal;color:#1a1a1a;letter-spacing:1px;">
                        Order Confirmed
                      </h1>
                    </td>
                  </tr>

                  <!-- Greeting -->
                  <tr>
                    <td style="padding:32px 48px 0;">
                      <p style="margin:0;font-size:15px;color:#444;line-height:1.7;">
                        Thank you for your purchase, %s. Your order has been received and
                        will be prepared for shipment. You'll receive a follow-up email
                        with tracking information once it ships.
                      </p>
                    </td>
                  </tr>

                  <!-- Artwork list -->
                  <tr>
                    <td style="padding:28px 48px 0;">
                      <table width="100%%" cellpadding="0" cellspacing="0"
                             style="border:1px solid #e0ddd6;">
                        <tr>
                          <td style="padding:16px 24px;border-bottom:1px solid #e0ddd6;">
                            <p style="margin:0;font-size:11px;letter-spacing:3px;color:#999;text-transform:uppercase;">
                              %s ordered
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px 24px;">
                            <table width="100%%" cellpadding="0" cellspacing="0">
                              %s
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Order meta -->
                  <tr>
                    <td style="padding:16px 48px 28px;">
                      <table width="100%%" cellpadding="0" cellspacing="0"
                             style="border:1px solid #e0ddd6;">
                        <tr>
                          <td style="padding:20px 24px;">
                            <table width="100%%" cellpadding="0" cellspacing="0"
                                   style="font-size:13px;color:#666;line-height:2;">
                              <tr>
                                <td style="color:#999;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Order</td>
                                <td align="right">#%d</td>
                              </tr>
                              <tr>
                                <td style="color:#999;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Total</td>
                                <td align="right" style="font-weight:bold;color:#1a1a1a;">%s</td>
                              </tr>
                              <tr>
                                <td style="color:#999;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Ship to</td>
                                <td align="right">%s</td>
                              </tr>
                              <tr>
                                <td style="color:#999;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Address</td>
                                <td align="right" style="color:#444;">%s</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:0 48px 40px;text-align:center;">
                      <p style="margin:0;font-size:12px;color:#aaa;line-height:1.8;">
                        Questions about your order? Reply to this email.<br/>
                        &copy; %d Valdivia.co All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>

        </body>
        </html>
        """
        .formatted(
            order.getShippingName(),
            itemLabel,
            artworkRows,
            order.getId(),
            formattedAmount,
            order.getShippingName(),
            shippingAddress,
            java.time.LocalDate.now().getYear());
  }

  // ── Contact
  // ───────────────────────────────────────────────────────────────────

  public void sendContactEmail(ContactRequest request) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setFrom("inquiries@valdivia.co");
      helper.setTo("contact@valdivia.co");
      helper.setReplyTo(request.email());
      helper.setSubject("New message: " + request.subject());
      helper.setText(buildContactEmailHtml(request), true);

      mailSender.send(message);
    } catch (MessagingException e) {
      System.out.println("Failed to send contact email from " + request.email() + " " + e.getMessage());
    }
  }

  private String buildContactEmailHtml(ContactRequest request) {
    return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin:0;padding:0;background:#f5f5f0;font-family:Georgia,serif;">

          <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0"
                       style="background:#ffffff;border:1px solid #e0ddd6;max-width:560px;width:100%%;">

                  <!-- Header -->
                  <tr>
                    <td style="padding:40px 48px 32px;border-bottom:1px solid #e0ddd6;text-align:center;">
                      <p style="margin:0 0 8px;font-size:11px;letter-spacing:4px;color:#999;text-transform:uppercase;">
                        Valdivia Art
                      </p>
                      <h1 style="margin:0;font-size:26px;font-weight:normal;color:#1a1a1a;letter-spacing:1px;">
                        New Message
                      </h1>
                    </td>
                  </tr>

                  <!-- Message body -->
                  <tr>
                    <td style="padding:32px 48px 0;">
                      <p style="margin:0;font-size:15px;color:#444;line-height:1.7;">%s</p>
                    </td>
                  </tr>

                  <!-- Sender details -->
                  <tr>
                    <td style="padding:28px 48px;">
                      <table width="100%%" cellpadding="0" cellspacing="0"
                             style="border:1px solid #e0ddd6;">
                        <tr>
                          <td style="padding:20px 24px;">
                            <table width="100%%" cellpadding="0" cellspacing="0"
                                   style="font-size:13px;color:#666;line-height:2;">
                              <tr>
                                <td style="color:#999;letter-spacing:1px;text-transform:uppercase;font-size:11px;">From</td>
                                <td align="right">%s</td>
                              </tr>
                              <tr>
                                <td style="color:#999;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Email</td>
                                <td align="right">
                                  <a href="mailto:%s" style="color:#1a1a1a;">%s</a>
                                </td>
                              </tr>
                              <tr>
                                <td style="color:#999;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Subject</td>
                                <td align="right">%s</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:0 48px 40px;text-align:center;">
                      <p style="margin:0;font-size:12px;color:#aaa;line-height:1.8;">
                        Reply directly to this email to respond to %s.<br/>
                        &copy; %d Valdivia Art. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>

        </body>
        </html>
        """
        .formatted(
            request.message(),
            request.name(),
            request.email(),
            request.email(),
            request.subject(),
            request.name(),
            java.time.LocalDate.now().getYear());
  }

  // ── Shipping notification
  // ─────────────────────────────────────────────────────

  public void sendShippingNotification(Order order) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setFrom("mail@dominickcs.com");
      helper.setTo(order.getUser().getEmail());
      helper.setSubject("Your order has shipped – " + artworkSubjectLabel(order));
      helper.setText(buildShippingEmailHtml(order), true);

      mailSender.send(message);
    } catch (MessagingException e) {
      System.out.println("Failed to send shipping notification for order " + order.getId() + " " + e.getMessage());
    }
  }

  private String buildShippingEmailHtml(Order order) {
    String artworkRows = buildArtworkRows(order.getArtworks());
    int itemCount = order.getArtworks().size();
    String itemLabel = itemCount == 1 ? "1 item" : itemCount + " items";
    String carrierName = order.getCarrier() != null ? order.getCarrier().name() : "the carrier";

    return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin:0;padding:0;background:#f5f5f0;font-family:Georgia,serif;">

          <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0"
                       style="background:#ffffff;border:1px solid #e0ddd6;max-width:560px;width:100%%;">

                  <!-- Header -->
                  <tr>
                    <td style="padding:40px 48px 32px;border-bottom:1px solid #e0ddd6;text-align:center;">
                      <p style="margin:0 0 8px;font-size:11px;letter-spacing:4px;color:#999;text-transform:uppercase;">
                        Valdivia Art
                      </p>
                      <h1 style="margin:0;font-size:26px;font-weight:normal;color:#1a1a1a;letter-spacing:1px;">
                        Your order is on its way
                      </h1>
                    </td>
                  </tr>

                  <!-- Greeting -->
                  <tr>
                    <td style="padding:32px 48px 0;">
                      <p style="margin:0;font-size:15px;color:#444;line-height:1.7;">
                        Good news, %s — your %s been packed and handed off to %s.
                        Use the tracking link below to follow the journey.
                      </p>
                    </td>
                  </tr>

                  <!-- Artwork list -->
                  <tr>
                    <td style="padding:28px 48px 0;">
                      <table width="100%%" cellpadding="0" cellspacing="0"
                             style="border:1px solid #e0ddd6;">
                        <tr>
                          <td style="padding:16px 24px;border-bottom:1px solid #e0ddd6;">
                            <p style="margin:0;font-size:11px;letter-spacing:3px;color:#999;text-transform:uppercase;">
                              %s shipped
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px 24px;">
                            <table width="100%%" cellpadding="0" cellspacing="0">
                              %s
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Tracking + order meta -->
                  <tr>
                    <td style="padding:16px 48px 28px;">
                      <table width="100%%" cellpadding="0" cellspacing="0"
                             style="border:1px solid #e0ddd6;">
                        <tr>
                          <td style="padding:20px 24px;">
                            <table width="100%%" cellpadding="0" cellspacing="0"
                                   style="font-size:13px;color:#666;line-height:2;">
                              <tr>
                                <td style="color:#999;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Order</td>
                                <td align="right">#%d</td>
                              </tr>
                              <tr>
                                <td style="color:#999;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Carrier</td>
                                <td align="right">%s</td>
                              </tr>
                              <tr>
                                <td style="color:#999;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Tracking</td>
                                <td align="right">
                                  <a href="%s" style="color:#1a1a1a;text-decoration:underline;">%s</a>
                                </td>
                              </tr>
                              <tr>
                                <td style="color:#999;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Ship to</td>
                                <td align="right">%s, %s %s</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:0 48px 40px;text-align:center;">
                      <p style="margin:0;font-size:12px;color:#aaa;line-height:1.8;">
                        Questions about your shipment? Reply to this email.<br/>
                        &copy; %d Valdivia Art. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>

        </body>
        </html>
        """
        .formatted(
            order.getShippingName(),
            itemCount == 1 ? "piece has" : "pieces have",
            carrierName,
            itemLabel,
            artworkRows,
            order.getId(),
            carrierName,
            order.getTrackingURL(),
            order.getTrackingNumber(),
            order.getShippingCity(),
            order.getShippingState(),
            order.getShippingPostalCode(),
            java.time.LocalDate.now().getYear());
  }
}
