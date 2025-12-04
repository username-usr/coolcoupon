import { NextResponse } from 'next/server';
import { twilioClient } from '@/lib/twilio'; // Assuming @/lib alias or adjust path
import { generateCouponCode } from '@/lib/utils'; // Assuming @/lib alias or adjust path

import prisma from '@/lib/prisma'; // Assuming your Prisma Client is in lib/prisma.ts

const TWILIO_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export async function POST(request: Request) {
    if (!TWILIO_NUMBER) {
        return NextResponse.json({ error: 'Twilio Sender Number is not configured.' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { phoneNumber } = body; // This is the E.164 number from the form

        if (!phoneNumber || typeof phoneNumber !== 'string') {
            return NextResponse.json({ error: 'Invalid phone number provided.' }, { status: 400 });
        }

        // --- 1. Check for Existing Coupon ---
        const existingCoupon = await prisma.coupon.findFirst({
            where: {
                phone: phoneNumber,
                // Check if the user has an unredeemed coupon that hasn't expired
                redeemed: false,
                expiresAt: {
                    gt: new Date(), // greater than current date
                },
            },
        });

        if (existingCoupon) {
            return NextResponse.json({ 
                error: 'You already have an active coupon. Please use that one first.' 
            }, { status: 409 });
        }

        // --- 2. Generate and Save New Coupon ---
        const code = generateCouponCode();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 2); // Coupon expires in 48 hours (2 days)

        const newCoupon = await prisma.coupon.create({
            data: {
                phone: phoneNumber,
                code: code,
                expiresAt: expiresAt,
            },
        });

        // --- 3. Send SMS via Twilio ---
        const messageBody = `🎉 Your Exclusive OFF coupon code is: ${code}. It expires in 48 hours. Enjoy your savings!`;

        await twilioClient.messages.create({
            body: messageBody,
            to: newCoupon.phone,
            from: TWILIO_NUMBER,
        });

        console.log(`Successfully sent coupon ${code} to ${newCoupon.phone}`);

        return NextResponse.json({ success: true, code: code, expiresAt: newCoupon.expiresAt }, { status: 200 });

    } catch (error) {
        console.error('API Error:', error);
        // Catch Prisma unique constraint error (e.g., if code generation somehow duplicates)
        if (error instanceof Error && error.message.includes('Unique constraint failed')) {
             return NextResponse.json({ error: 'Could not generate a unique code. Please try again.' }, { status: 500 });
        }
        return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
    }
}