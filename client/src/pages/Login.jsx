// import React, { useContext, useState } from 'react'
// import assets from '../assets/assets'
// import { AuthContext } from '../../context/AuthContext'

// const Login = () => {
//   // use a consistent mode string ('signup' or 'login')
//   const [mode, setMode] = useState('signup')
//   const [stepTwo, setStepTwo] = useState(false) // signup step control

//   const [fullName, setFullName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [bio, setBio] = useState('')
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState(null)

//   const { login } = useContext(AuthContext)

//   // Final submit (only called when ready)
//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError(null)

//     // Basic client-side validation
//     if (mode === 'signup') {
//       if (!fullname.trim() || !email.trim() || !password.trim() || !bio.trim()) {
//         setError('Please fill all signup fields.')
//         return
//       }
//     } else {
//       if (!email.trim() || !password.trim()) {
//         setError('Please enter email and password.')
//         return
//       }
//     }

//     setIsSubmitting(true)
//     try {
//       const payload = { fullName, email, password, bio }
//       console.log('Submitting auth:', mode, payload) // debug line
//       // call context/login or your API wrapper
//       await login(mode === 'signup' ? 'signup' : 'login', payload)
//     } catch (err) {
//       console.error(err)
//       setError(err.message || 'Submission failed')
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // "Next" to show the bio step (only for signup)
//   const handleNext = (e) => {
//     e.preventDefault()
//     // validate first-step fields before going next
//     if (!fullName.trim() || !email.trim() || !password.trim()) {
//       setError('Please fill name, email and password to continue.')
//       return
//     }
//     setError(null)
//     setStepTwo(true)
//   }

//   // reset when switching mode
//   const switchToLogin = () => {
//     setMode('login')
//     setStepTwo(false)
//     setError(null)
//   }
//   const switchToSignup = () => {
//     setMode('signup')
//     setStepTwo(false)
//     setError(null)
//   }

//   return (
//     <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
//       <img src={assets.logo_big} className='w-[min(30vw,250px)]' alt="" />

//       <form onSubmit={handleSubmit} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
//         <h2 className='font-medium text-2xl flex justify-between items-center'>
//           {mode === 'signup' ? 'Sign up' : 'Log in'}
//           {stepTwo && mode === 'signup' && (
//             <img onClick={() => setStepTwo(false)} src={assets.arrow_icon} className='w-5 cursor-pointer' alt="back" />
//           )}
//         </h2>

//         {/* Step 1 fields (both login and signup) */}
//         {!stepTwo && (
//           <>
//             {mode === 'signup' && (
//               <input
//                 onChange={(e) => setFullName(e.target.value)}
//                 value={fullName}
//                 type="text"
//                 className='p-2 border-gray-500 rounded-md focus:outline-none'
//                 placeholder='Full Name'
//                 // don't use required here (we validate manually)
//               />
//             )}

//             <input
//               onChange={(e) => setEmail(e.target.value)}
//               value={email}
//               className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
//               type="email"
//               placeholder='Email Address'
//             />

//             <input
//               onChange={(e) => setPassword(e.target.value)}
//               value={password}
//               className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
//               type="password"
//               placeholder='Password'
//             />
//           </>
//         )}

//         {/* Step 2 for signup: bio */}
//         {mode === 'signup' && stepTwo && (
//           <textarea
//             onChange={(e) => setBio(e.target.value)}
//             value={bio}
//             rows={4}
//             className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
//             placeholder='Provide a Short Bio'
//           />
//         )}

//         {/* Buttons: show Next for step 1 signup, Submit for login or signup step 2 */}
//         <div className='flex flex-col gap-2'>
//           {!stepTwo && mode === 'signup' ? (
//             // Next advances to bio step (type=button avoids native form validation)
//             <button type='button' onClick={handleNext} className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md'>
//               Next
//             </button>
//           ) : (
//             <button type='submit' disabled={isSubmitting} className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md'>
//               {mode === 'signup' ? (isSubmitting ? 'Creating...' : 'Create Account') : (isSubmitting ? 'Logging in...' : 'Log In Now')}
//             </button>
//           )}

//           {error && <div className='text-red-400 text-sm'>{error}</div>}
//         </div>

//         <div className='flex items-center gap-2 text-sm text-gray-500'>
//           <input type="checkbox" id="terms" />
//           <label htmlFor="terms">Agree to the terms of use & privacy policy</label>
//         </div>

//         <div className='flex flex-col gap-2'>
//           {mode === 'signup' ? (
//             <p>Already have an account? <span className='text-blue-500 cursor-pointer' onClick={switchToLogin}>Log in</span></p>
//           ) : (
//             <p>Don't have an account? <span className='text-blue-500 cursor-pointer' onClick={switchToSignup}>Sign up</span></p>
//           )}
//         </div>
//       </form>
//     </div>
//   )
// }

// export default Login



import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  // signup / login mode
  const [mode, setMode] = useState("signup");
  const [stepTwo, setStepTwo] = useState(false);

  // form states
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext); // uses context to hit backend

  // --------------------------------------------------------------------
  // handle submit (final submission)
  // --------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // front-end validation
    if (mode === "signup") {
      if (!fullname.trim() || !email.trim() || !password.trim() || !bio.trim()) {
        setError("Please fill all signup fields.");
        return;
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setError("Please enter email and password.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // ✅ correct payload keys (match backend)
      const payload = { fullname, email, password, bio };
      console.log("Submitting auth:", mode, payload);

      // call context login/signup function
      await login(mode === "signup" ? "signup" : "login", payload);
    } catch (err) {
      console.error(err);
      setError(err.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------------------------
  // handle next step for signup (move to bio input)
  // --------------------------------------------------------------------
  const handleNext = (e) => {
    e.preventDefault();
    if (!fullname.trim() || !email.trim() || !password.trim()) {
      setError("Please fill name, email and password to continue.");
      return;
    }
    setError(null);
    setStepTwo(true);
  };

  // mode switchers
  const switchToLogin = () => {
    setMode("login");
    setStepTwo(false);
    setError(null);
  };

  const switchToSignup = () => {
    setMode("signup");
    setStepTwo(false);
    setError(null);
  };

  // --------------------------------------------------------------------
  // UI
  // --------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      <img src={assets.logo_big} className="w-[min(30vw,250px)]" alt="" />

      <form
        onSubmit={handleSubmit}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {mode === "signup" ? "Sign up" : "Log in"}
          {stepTwo && mode === "signup" && (
            <img
              onClick={() => setStepTwo(false)}
              src={assets.arrow_icon}
              className="w-5 cursor-pointer"
              alt="back"
            />
          )}
        </h2>

        {/* Step 1 fields (signup + login) */}
        {!stepTwo && (
          <>
            {mode === "signup" && (
              <input
                onChange={(e) => setFullname(e.target.value)}
                value={fullname}
                type="text"
                className="p-2 border-gray-500 rounded-md focus:outline-none"
                placeholder="Full Name"
              />
            )}

            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="email"
              placeholder="Email Address"
            />

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              placeholder="Password"
            />
          </>
        )}

        {/* Step 2 (signup only) */}
        {mode === "signup" && stepTwo && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Provide a Short Bio"
          />
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          {!stepTwo && mode === "signup" ? (
            <button
              type="button"
              onClick={handleNext}
              className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md"
            >
              {mode === "signup"
                ? isSubmitting
                  ? "Creating..."
                  : "Create Account"
                : isSubmitting
                ? "Logging in..."
                : "Log In Now"}
            </button>
          )}

          {error && <div className="text-red-400 text-sm">{error}</div>}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" id="terms" />
          <label htmlFor="terms">
            Agree to the terms of use & privacy policy
          </label>
        </div>

        <div className="flex flex-col gap-2">
          {mode === "signup" ? (
            <p>
              Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={switchToLogin}
              >
                Log in
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={switchToSignup}
              >
                Sign up
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
