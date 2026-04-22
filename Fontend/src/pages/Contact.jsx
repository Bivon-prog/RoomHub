import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import emailjs from '@emailjs/browser'

// ── EmailJS config ──────────────────────────────────────────────
// 1. Go to https://www.emailjs.com and create a free account
// 2. Add an Email Service (Gmail recommended) → copy Service ID
// 3. Create an Email Template with variables: {{from_name}}, {{from_email}}, {{message}}
//    Set "To Email" in the template to your email address
// 4. Copy your Public Key from Account → API Keys
// Replace the three values below:
const EMAILJS_SERVICE_ID  = 'service_4y7w66v'
const EMAILJS_TEMPLATE_ID = 'template_tu8s9eu'
const EMAILJS_PUBLIC_KEY  = 'BeWSu11W2gvNBHbM_'
// ────────────────────────────────────────────────────────────────

export default function Contact() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  async function onSubmit(data) {
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  data.name,
          from_email: data.email,
          message:    data.message,
        },
        EMAILJS_PUBLIC_KEY
      )
      toast.success('Message sent! We will get back to you shortly.')
      reset()
    } catch (err) {
      console.error(err)
      toast.error('Failed to send message. Please try again.')
    }
  }

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Contact Us</h2>
        <div className="form-group">
          <label>Name</label>
          <input {...register('name', { required: true })} placeholder="Your name" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register('email', { required: true })} placeholder="Your email" />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea {...register('message', { required: true })} rows={5} placeholder="How can we help?" />
        </div>
        <button type="submit" className="btn-primary btn-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
