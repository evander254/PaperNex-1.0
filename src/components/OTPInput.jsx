import React, { useState, useRef, useEffect } from 'react';

export default function OTPInput({ length = 6, onComplete }) {
    const [otp, setOtp] = useState(Array(length).fill(""));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }

        const currentOtp = newOtp.join("");
        if (currentOtp.length === length) {
            onComplete(currentOtp);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, length).split('');
        if (pastedData.some(isNaN)) return;

        const newOtp = [...otp];
        pastedData.forEach((char, index) => {
            newOtp[index] = char;
        });
        setOtp(newOtp);

        if (pastedData.length === length) {
            onComplete(newOtp.join(""));
            inputRefs.current[length - 1]?.focus();
        } else if (inputRefs.current[pastedData.length]) {
            inputRefs.current[pastedData.length].focus();
        }
    };

    return (
        <div className="flex justify-center gap-2 sm:gap-3 my-6">
            {otp.map((value, index) => (
                <input
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    type="text"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-semibold bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-gray-500"
                />
            ))}
        </div>
    );
}
