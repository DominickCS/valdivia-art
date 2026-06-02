package com.valdivia.art.entity.enums;

public enum Carrier {
  UPS("https://www.ups.com/track?tracknum="),
  USPS("https://tools.usps.com/go/TrackConfirmAction?tLabels="),
  FEDEX("https://www.fedex.com/fedextrack/?trknbr=");

  private final String trackingBaseURL;

  Carrier(String trackingBaseURL) {
    this.trackingBaseURL = trackingBaseURL;
  }

  public String buildTrackingURL(String trackingNumber) {
    return trackingBaseURL + trackingNumber;
  }
}
