"use client";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import useAuthModal from "@/hooks/useAuthModal";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/**
 * Shared demo account with an active subscription. The password is public on
 * purpose; the database blocks uploads from this account (see RLS policies).
 */
const DEMO_EMAIL = "demo@spotify-clone.local";
const DEMO_PASSWORD = "bb9a7e7e7c9236b3ed9442ff";

const AuthModal = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { session } = useSessionContext();
  const { onClose, isOpen } = useAuthModal();
  const [demoLoading, setDemoLoading] = useState(false);

  const signInAsDemo = async () => {
    setDemoLoading(true);
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    setDemoLoading(false);
    if (error) toast.error("The demo is not available right now.");
  };

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    }
  }, [session, router, onClose]);

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <Modal
      title="Welcome back"
      description="Login to your account"
      isOpen={isOpen}
      onChange={onChange}
    >
      <button
        type="button"
        onClick={signInAsDemo}
        disabled={demoLoading}
        className="mb-4 w-full rounded-full bg-green-500 px-3 py-3 font-bold text-black transition hover:opacity-75 disabled:opacity-50"
      >
        {demoLoading ? "Signing in…" : "Try the demo (Premium, no sign-up)"}
      </button>
      <Auth
        theme="dark"
        magicLink
        providers={[]}
        supabaseClient={supabaseClient}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#404040",
                brandAccent: "#22c55e",
              },
            },
          },
        }}
      />
    </Modal>
  );
};

export default AuthModal;
