import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface PaymentRequestParams {
  amount: number; // تومان
  description?: string;
  metadata?: Record<string, any>;
}

interface PaymentRequestResult {
  authority: string;
  url: string;
}

interface PaymentVerifyResult {
  code: number;
  ref_id?: string;
  card_pan?: string;
  [key: string]: any;
}

@Injectable()
export class ZarinpalService {
  private readonly merchantId: string;
  private readonly callbackUrl: string;
  private readonly baseUrl = 'https://sandbox.zarinpal.com/pg/v4/payment';

  constructor(private readonly configService: ConfigService) {
    const payConfig = this.configService.get<{
      merchant_id: string;
      callback_url: string;
    }>('pay');

    if (!payConfig?.merchant_id || !payConfig?.callback_url) {
      throw new Error('ZarinpalService requires merchantId and callbackUrl');
    }

    this.merchantId = payConfig.merchant_id;
    this.callbackUrl = payConfig.callback_url;
  }

  /** ارسال درخواست پرداخت */
  async requestPayment(
    params: PaymentRequestParams,
  ): Promise<PaymentRequestResult> {
    const { amount, description, metadata } = params;
    const payload = {
      merchant_id: this.merchantId,
      amount: this.toRial(amount),
      description: description ?? 'Payment',
      callback_url: this.callbackUrl,
      metadata,
    };

    const res = await axios.post(`${this.baseUrl}/request.json`, payload);

    if (!res?.data?.data || res.data.data.code !== 100) {
      throw new Error('Zarinpal request failed');
    }

    const authority = res.data.data.authority;
    return {
      authority,
      url: `https://sandbox.zarinpal.com/pg/StartPay/${authority}`,
    };
  }

  /** تایید پرداخت */
  async verifyPayment(
    authority: string,
    amount: number,
  ): Promise<PaymentVerifyResult> {
    const payload = {
      merchant_id: this.merchantId,
      amount: this.toRial(amount),
      authority,
    };

    const res = await axios.post(`${this.baseUrl}/verify.json`, payload);

    if (!res?.data?.data) {
      throw new Error('Zarinpal verify failed');
    }

    return res.data.data;
  }

  private toRial(amount: number): number {
    return amount * 10;
  }
}
