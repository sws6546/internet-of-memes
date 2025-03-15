import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";

export default function AuthPage() {
  return (
    <main className="w-full flex justify-center">
      <section className="w-full md:w-1/2">
        <div className="tabs tabs-border flex items-center">
          <input type="radio" name="authenticate_tabs" className="tab" aria-label="I don't have account" defaultChecked />
          <div className="tab-content p-10"><RegisterForm /></div>

          <input type="radio" name="authenticate_tabs" className="tab" aria-label="I already have account" />
          <div className="tab-content p-10"><LoginForm /></div>
        </div>
      </section>
    </main>
  )
}