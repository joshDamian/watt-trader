import React, { type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInInputs, type SignInInputs } from "~/data/schemas/auth";

interface SignInProps {
  signIn: (email: string) => Promise<void>;
}

const SignIn: FC<SignInProps> = ({ signIn }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInInputs>({
    resolver: zodResolver(signInInputs),
    mode: "onSubmit",
  });

  const onSubmit = async (data: SignInInputs) => {
    try {
      await signIn(data.email);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="flex w-full flex-1 flex-col gap-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full flex-col gap-2.5">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          className="w-full rounded-md border border-gray-200 p-5"
          {...register("email")}
          placeholder="Email"
          type="email"
        />

        {errors.email ? (
          <p className="text-red-500">{errors.email.message}</p>
        ) : null}
      </div>

      <button
        className="rounded-md bg-green-500 px-7 py-2.5 text-center text-white"
        type="submit"
      >
        {isSubmitting ? "Submitting..." : "Sign In"}
      </button>
    </form>
  );
};

export default SignIn;
