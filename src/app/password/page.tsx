import type { Metadata } from "next";
import { PasswordGenerator } from "@/components/calculators/password";

export const metadata: Metadata = {
  title: "비밀번호 생성기",
  description: "안전한 랜덤 비밀번호를 생성합니다. 길이, 대소문자, 숫자, 특수문자 옵션을 설정할 수 있습니다.",
  keywords: ["비밀번호 생성기", "랜덤 비밀번호", "안전한 비밀번호", "패스워드"],
};

export default function PasswordPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <PasswordGenerator />
      </section>
    </div>
  );
}
