package com.valdivia.art.entity.enums;

public enum Carrier {
  UPS("https://www.ups.com/track?tracknum="),
  USPS("https://tools.usps.com/go/TrackConfirmAction?tLabels="),
  FEDEX("https://www.fedex.com/fedextrack/?trknbr=");

  private final String trackingBaseUrl;

  Carrier(String trackingBaseUrl) {
    this.trackingBaseUrl = trackingBaseUrl;
  }

  public String buildTrackingUrl(String trackingNumber) {
    return trackingBaseUrl + trackingNumber;
  }
}
