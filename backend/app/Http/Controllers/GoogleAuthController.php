<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Obtain the user information from Google OAuth callback.
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', strtolower($googleUser->getEmail()))
                ->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->getName() ?: 'Comic Fan',
                    'email' => strtolower($googleUser->getEmail()),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar() ?: 'https://api.dicebear.com/7.x/bottts/svg?seed=' . urlencode($googleUser->getName() ?: 'Comic'),
                    'level' => 1,
                    'xp' => 0,
                    'streak' => 1,
                ]);
            } else if (empty($user->google_id)) {
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $user->avatar ?: $googleUser->getAvatar(),
                ]);
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3032');

            return redirect()->away("{$frontendUrl}/auth/callback?token=" . urlencode($token) . "&name=" . urlencode($user->name) . "&email=" . urlencode($user->email));

        } catch (\Exception $e) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3032');
            return redirect()->away("{$frontendUrl}/login?error=" . urlencode('Google authentication failed: ' . $e->getMessage()));
        }
    }

    /**
     * Authenticate or create user using Google payload/token directly from SPA frontend.
     */
    public function handleGoogleToken(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'name' => 'nullable|string',
            'google_id' => 'nullable|string',
            'avatar' => 'nullable|string',
        ]);

        $user = User::where('email', strtolower($validated['email']))
            ->orWhere('google_id', $validated['google_id'] ?? null)
            ->first();

        if (!$user) {
            $userName = $validated['name'] ?? 'Comic Fan';
            $user = User::create([
                'name' => $userName,
                'email' => strtolower($validated['email']),
                'google_id' => $validated['google_id'] ?? ('google_' . Str::random(10)),
                'avatar' => $validated['avatar'] ?? ('https://api.dicebear.com/7.x/bottts/svg?seed=' . urlencode($userName)),
                'level' => 1,
                'xp' => 0,
                'streak' => 1,
            ]);
        } else if (!empty($validated['google_id']) && empty($user->google_id)) {
            $user->update(['google_id' => $validated['google_id']]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Signed in with Google successfully',
            'token' => $token,
            'user' => $user,
        ]);
    }
}
