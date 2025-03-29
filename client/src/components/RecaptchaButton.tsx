import ReCAPTCHA from "react-google-recaptcha"

export default function RecaptchaButton({setGCaptcha}: {setGCaptcha: React.Dispatch<React.SetStateAction<string>>}) {
  return (
    <ReCAPTCHA
      sitekey={`${import.meta.env.VITE_GOOGLE_CAPTCHA_SITE_KEY}`}
      onChange={(e) => {setGCaptcha(e || "")}}
    />
  )
}
