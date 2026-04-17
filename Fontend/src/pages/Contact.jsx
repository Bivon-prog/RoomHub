import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function Contact() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  function onSubmit(data) {
    // In production, wire this to an email API
    console.log('Contact form:', data)
    toast.success('Message sent! We will get back to you shortly.')
    reset()
  }

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Contact Us</h2>
        <div className="form-group"><label>Name</label><input {...register('name', { required: true })} placeholder="Your name" /></div>
        <div className="form-group"><label>Email</label><input type="email" {...register('email', { required: true })} placeholder="Your email" /></div>
        <div className="form-group"><label>Message</label><textarea {...register('message', { required: true })} rows={5} placeholder="How can we help?" /></div>
        <button type="submit" className="btn-primary btn-full" disabled={isSubmitting}>Send Message</button>
      </form>
    </div>
  )
}
