export default function AuthPage() {
  return (
    <main className="w-full md:w-1/2">
      <div className="tabs tabs-border">
        <input type="radio" name="authenticate_tabs" className="tab" aria-label="I don't have account" defaultChecked />
        <div className="tab-content p-10">Tab content 1</div>

        <input type="radio" name="authenticate_tabs" className="tab" aria-label="I already have account" />
        <div className="tab-content p-10">Tab content 2</div>
      </div>
    </main>
  )
}
