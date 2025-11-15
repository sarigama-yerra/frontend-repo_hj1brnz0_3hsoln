import { useMemo, useState } from 'react'
import { Wallet, Landmark, CreditCard, QrCode, CheckCircle2, IndianRupee, ChevronRight, ShieldCheck, Building2 } from 'lucide-react'

const METHODS = [
  { key: 'upi', label: 'UPI', icon: QrCode },
  { key: 'wallet', label: 'Wallets', icon: Wallet },
  { key: 'card', label: 'Cards', icon: CreditCard },
  { key: 'netbanking', label: 'Net Banking', icon: Landmark },
]

const WALLETS = [
  { key: 'paytm', name: 'Paytm', color: 'bg-blue-600' },
  { key: 'phonepe', name: 'PhonePe', color: 'bg-violet-600' },
  { key: 'gpay', name: 'Google Pay', color: 'bg-indigo-600' },
  { key: 'amazon', name: 'Amazon Pay', color: 'bg-amber-600' },
]

function classNames(...c) { return c.filter(Boolean).join(' ') }

export default function PaymentsPage() {
  const [amount, setAmount] = useState('999')
  const [method, setMethod] = useState('upi')
  const [processing, setProcessing] = useState(false)
  const [status, setStatus] = useState(null)

  const canPay = useMemo(() => {
    const num = Number(amount)
    return !Number.isNaN(num) && num > 0
  }, [amount])

  async function handlePay(e) {
    e.preventDefault()
    if (!canPay) return
    setProcessing(true)
    setStatus(null)
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 1200))
    setProcessing(false)
    setStatus({ ok: true, message: 'Payment successful' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <header className="sticky top-0 backdrop-blur bg-white/70 border-b border-slate-200/60 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">₿</div>
            <div>
              <p className="text-sm text-slate-500">Secure Checkout</p>
              <h1 className="text-lg font-semibold text-slate-800">Complete your payment</h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
            <ShieldCheck className="size-5 text-emerald-600" /> 256-bit encryption
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/5 overflow-hidden">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-slate-100 p-4 md:p-6">
                <h2 className="text-sm font-semibold text-slate-700 mb-3">Payment method</h2>
                <nav className="space-y-2">
                  {METHODS.map(m => {
                    const Icon = m.icon
                    const active = method === m.key
                    return (
                      <button key={m.key} onClick={() => setMethod(m.key)} className={classNames('w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition shadow-sm shadow-transparent', active ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' : 'hover:bg-slate-50 text-slate-700 ring-1 ring-transparent hover:ring-slate-200')}> 
                        <span className={classNames('size-9 inline-flex items-center justify-center rounded-lg', active ? 'bg-white text-indigo-600' : 'bg-slate-100 text-slate-600')}>
                          <Icon className="size-5" />
                        </span>
                        <span className="flex-1 text-left font-medium">{m.label}</span>
                        <ChevronRight className={classNames('size-4 transition', active ? 'opacity-100 text-indigo-500' : 'opacity-0')} />
                      </button>
                    )
                  })}
                </nav>

                <div className="mt-6 rounded-xl bg-gradient-to-tr from-slate-50 to-white p-4 ring-1 ring-slate-100">
                  <p className="text-xs text-slate-500">We support UPI, top wallets and net-banking from 60+ banks.</p>
                </div>
              </div>

              <div className="md:col-span-3 p-4 md:p-6">
                <h2 className="text-sm font-semibold text-slate-700 mb-4">Enter details</h2>

                <form onSubmit={handlePay} className="space-y-5">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><IndianRupee className="size-4" /></span>
                      <input value={amount} onChange={e => setAmount(e.target.value)} type="number" min="1" step="1" placeholder="Enter amount" className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400" />
                    </div>
                  </div>

                  {method === 'upi' && <UPISection />}
                  {method === 'wallet' && <WalletSection />}
                  {method === 'card' && <CardSection />}
                  {method === 'netbanking' && <NetbankingSection />}

                  <button disabled={!canPay || processing} className={classNames('w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition', (!canPay || processing) ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white')}>
                    {processing ? 'Processing…' : 'Pay now'}
                  </button>

                  {status?.ok && (
                    <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
                      <CheckCircle2 className="size-5" />
                      <span className="text-sm">{status.message}</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-1">
          <OrderSummary amount={amount} />
        </aside>
      </main>

      <footer className="max-w-6xl mx-auto px-4 pb-10 text-center text-xs text-slate-500">
        By proceeding, you agree to our Terms and privacy policies.
      </footer>
    </div>
  )
}

function UPISection() {
  const [mode, setMode] = useState('id') // id | qr
  return (
    <div className="space-y-4">
      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => setMode('id')} className={classNames('px-3 py-1.5 rounded-full border', mode==='id' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600')}>Pay via UPI ID</button>
        <button type="button" onClick={() => setMode('qr')} className={classNames('px-3 py-1.5 rounded-full border', mode==='qr' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600')}>Scan QR</button>
      </div>

      {mode === 'id' ? (
        <div>
          <label className="block text-sm text-slate-600 mb-1">UPI ID</label>
          <input type="text" placeholder="yourname@upi" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400" />
          <p className="text-xs text-slate-500 mt-2">We will send a collect request to this UPI ID.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
          <div className="mx-auto size-28 rounded-lg bg-slate-100 grid place-items-center">
            <QrCode className="size-16 text-slate-500" />
          </div>
          <p className="mt-3 text-sm text-slate-600">Scan this QR with any UPI app</p>
        </div>
      )}
    </div>
  )
}

function WalletSection() {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {WALLETS.map(w => (
        <label key={w.key} className="relative cursor-pointer">
          <input type="radio" name="wallet" className="peer sr-only" />
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 peer-checked:border-indigo-300 peer-checked:bg-indigo-50 px-3 py-2.5">
            <span className={classNames('size-9 rounded-lg text-white grid place-items-center', w.color)}>
              <Wallet className="size-5" />
            </span>
            <span className="font-medium text-slate-800">{w.name}</span>
          </div>
        </label>
      ))}
    </div>
  )
}

function CardSection() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="block text-sm text-slate-600 mb-1">Card number</label>
        <input inputMode="numeric" placeholder="1234 5678 9012 3456" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400" />
      </div>
      <div>
        <label className="block text-sm text-slate-600 mb-1">Expiry</label>
        <input placeholder="MM/YY" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400" />
      </div>
      <div>
        <label className="block text-sm text-slate-600 mb-1">CVV</label>
        <input inputMode="numeric" placeholder="123" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400" />
      </div>
      <div className="col-span-2">
        <label className="block text-sm text-slate-600 mb-1">Name on card</label>
        <input placeholder="JOHN DOE" className="w-full uppercase tracking-wide px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400" />
      </div>
    </div>
  )
}

function NetbankingSection() {
  const banks = [
    { key: 'hdfc', name: 'HDFC Bank' },
    { key: 'icici', name: 'ICICI Bank' },
    { key: 'sbi', name: 'State Bank of India' },
    { key: 'axis', name: 'Axis Bank' },
    { key: 'kotak', name: 'Kotak Mahindra Bank' },
  ]
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {banks.map(b => (
        <label key={b.key} className="relative cursor-pointer">
          <input type="radio" name="bank" className="peer sr-only" />
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 peer-checked:border-indigo-300 peer-checked:bg-indigo-50 px-3 py-2.5">
            <span className="size-9 rounded-lg bg-slate-100 text-slate-600 grid place-items-center">
              <Building2 className="size-5" />
            </span>
            <span className="font-medium text-slate-800">{b.name}</span>
          </div>
        </label>
      ))}
    </div>
  )
}

function OrderSummary({ amount }) {
  const subtotal = Number(amount || 0)
  const fee = subtotal > 0 ? Math.max(5, Math.round(subtotal * 0.015)) : 0
  const total = subtotal + fee
  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/5 p-6 sticky top-20">
      <h3 className="text-base font-semibold text-slate-800">Order summary</h3>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-medium text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Processing fee</span>
          <span className="font-medium text-slate-800">₹{fee.toLocaleString('en-IN')}</span>
        </div>
        <div className="pt-2 mt-2 border-t border-dashed border-slate-200 flex justify-between text-slate-800 font-semibold">
          <span>Total</span>
          <span>₹{total.toLocaleString('en-IN')}</span>
        </div>
      </div>
      <div className="mt-4 text-xs text-slate-500 flex items-start gap-2">
        <ShieldCheck className="mt-0.5 size-4 text-emerald-600" />
        Payments are secured and encrypted. No card or UPI details are stored.
      </div>
    </div>
  )
}
