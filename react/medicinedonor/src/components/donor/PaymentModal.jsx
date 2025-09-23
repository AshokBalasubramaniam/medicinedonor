import React, { useState } from 'react';
import { createOrder, verifyPayment } from '../../api';

export default function PaymentModal({ patient, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('authToken');

  async function handlePay(e) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return alert('Enter valid amount');

    setLoading(true);
    try {
      // ✅ Backend returns { order_id, amount, currency, status, key_id }
      const orderResp = await createOrder(token, Number(amount));

      const options = {
        key: orderResp.key_id,
        amount: orderResp.amount, // backend already in paise
        currency: orderResp.currency,
        name: 'Hospital Donation',
        description: `Donation for ${patient.name}`,
        order_id: orderResp.order_id, // ✅ fixed field name

        handler: async function (res) {
          try {
            console.log(res, 'all responses');
            const verifyResp = await verifyPayment(token, {
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
            });

            alert('✅ Payment successful!');
            console.log('verifyResp', verifyResp);
            onSuccess();
          } catch (err) {
            console.error(err);
            alert('❌ ' + (err.error || 'Payment verification failed'));
          }
        },
        prefill: { name: patient.name },
        theme: { color: '#4f46e5' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        alert(
          '❌ Payment failed: ' + (resp.error?.description || 'Unknown error')
        );
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Failed to create Razorpay order');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.4)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#fff',
          padding: 18,
          borderRadius: 10,
        }}
      >
        <h3>Donate to {patient.name}</h3>
        <p>Remaining: ₹ {patient.amount_due}</p>
        <form onSubmit={handlePay}>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in ₹"
            style={{
              width: '100%',
              padding: 10,
              marginBottom: 8,
              borderRadius: 8,
              border: '1px solid #e6eef9',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: 10,
                borderRadius: 8,
                border: 'none',
                background: '#4f46e5',
                color: '#fff',
              }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
