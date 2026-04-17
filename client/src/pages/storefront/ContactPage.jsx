import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-lb-white pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
             <span className="text-xs uppercase tracking-widest text-lb-rose font-bold mb-2 block">Get in Touch</span>
             <h1 className="font-display text-4xl text-lb-black font-medium">Contact Us</h1>
             <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
               We’d love to hear from you. Please reach out to us using the details below.
             </p>
          </div>
           
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 shadow-lg shadow-pink-100/50 rounded-2xl border border-lb-border text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-lb-blush text-lb-rose rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg text-lb-black mb-2">Email</h3>
              <a href="mailto:abhibaishya07@gmail.com" className="text-gray-600 hover:text-lb-rose transition-colors text-sm">
                abhibaishya07@gmail.com
              </a>
            </div>

            <div className="bg-white p-8 shadow-lg shadow-pink-100/50 rounded-2xl border border-lb-border text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-lb-blush text-lb-rose rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg text-lb-black mb-2">Phone</h3>
              <a href="tel:6001728501" className="text-gray-600 hover:text-lb-rose transition-colors text-sm">
                6001728501
              </a>
            </div>

            <div className="bg-white p-8 shadow-lg shadow-pink-100/50 rounded-2xl border border-lb-border text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-lb-blush text-lb-rose rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg text-lb-black mb-2">Hours</h3>
              <p className="text-gray-600 text-sm">
                9am to 7pm
              </p>
            </div>
          </div>
          
        </div>
      </main>
      <Footer />
    </>
  );
}
