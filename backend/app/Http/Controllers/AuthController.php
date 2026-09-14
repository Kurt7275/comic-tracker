<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'password' => Hash::make($validated['password']),
            'avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=' . urlencode($validated['name']),
            'level' => 1,
            'xp' => 0,
            'streak' => 1,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Account registered successfully',
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    /**
     * Authenticate user and issue API token.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt(['email' => strtolower(trim($credentials['email'])), 'password' => $credentials['password']])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid email address or password',
            ], 401);
        }

        $user = User::where('email', strtolower(trim($credentials['email'])))->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Logged in successfully',
            'token' => $token,
            'user' => $user,
        ]);
    }

    /**
     * Revoke the user's active API token.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get the authenticated user's details.
     */
    public function me(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'user' => $request->user(),
        ]);
    }
}
