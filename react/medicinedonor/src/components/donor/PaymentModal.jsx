import React, { useState } from 'react';
import { createOrder, verifyPayment } from '../../api';
import amountpaid from '../../assets/amountpaid.png';

export default function PaymentModal({ patient, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('authToken');

  async function handlePay(e) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert('Enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      // ✅ Backend returns { order_id, amount, currency, key_id }
      const orderResp = await createOrder(token, Number(amount));

      const options = {
        key: orderResp.key_id,
        amount: orderResp.amount,
        currency: orderResp.currency,
        name: 'Hospital Donation',
        description: `Donation for ${patient.name}`,
        order_id: orderResp.order_id,

        handler: async function (res) {
          try {
            console.log(res, 'all responses');
            const verifyResp = await verifyPayment(token, {
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
              patient_id: patient.id,
              amount: Number(amount),
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
        alert('❌ Payment failed: ' + (resp.error?.description || 'Unknown error'));
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Failed to create Razorpay order');
    } finally {
      setLoading(false);
    }
  }

  const style = {
    maincontainer: {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.4)',
      zIndex: 1000,
    },
    card: {
      width: '100%',
      maxWidth: 440,
      height:"300px",
      backgroundImage: `url(${amountpaid})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: 24,
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      textAlign: 'center',
    },
    heading: {
      fontSize: '40px',
      color: 'black',
      marginBottom: 10,
    },
    patientheading: {
      background: '#0b9a9a',
      width: 'fit-content',
      padding: '10px 16px',
      borderRadius: '20px',
      margin: '0 auto 20px auto',
      color: '#fff',
      fontWeight: 'bold',
    },
    inputstyle: {
      width: '70%',
      padding: 10,
      marginBottom:30,
      borderRadius: 8,
      border: '1px solid #e6eef9',
      outline: 'none',
      fontSize: '16px',
       MozAppearance: 'textfield',
    },
    
    paybutton: {
      display: 'flex',
      justifyContent: 'center',
      gap: 25,
    },
    cancelbutton: {
      padding: '10px 16px',
      borderRadius: 8,
      border: '1px solid #ddd',
      background: '#fff',
      cursor: 'pointer',
    },
    submitbutton: {
      padding: '10px 16px',
      borderRadius: 8,
      border: 'none',
      background: '#4f46e5',
      color: '#fff',
      cursor: 'pointer',
    },
    
  };

  return (
    <div style={style.maincontainer}>
      <div style={style.card}>
        
        <h1 style={style.heading}>Donate to {patient.name}</h1>

        <div style={style.patientheading}>
          Remaining: ₹ {patient.balance_amount}
        </div>

        <form onSubmit={handlePay}>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in ₹"
            style={style.inputstyle}
          />

          <div style={style.paybutton}>
            <button type="button" onClick={onClose} style={style.cancelbutton}>
              Cancel
            </button>
            <button
              type="submit"
              style={style.submitbutton}
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
