<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CanvasController extends Controller
{
    public function save(Request $request)
    {
        // Update validation to match the structure of your modules
        $data = $request->validate([
            'modules' => 'required|array',
            'modules.*.id' => 'required|string',
            'modules.*.props' => 'required|array',
            'modules.*.props.x' => 'required|numeric',
            'modules.*.props.y' => 'required|numeric',
            'modules.*.props.width' => 'required|numeric',
            'modules.*.props.height' => 'required|numeric',
        ]);

        // Handle saving the modules data for the authenticated user
        auth()->user()->modules()->updateOrCreate(
            ['user_id' => auth()->id()],
            ['modules_data' => json_encode($data['modules'])]
        );

        return response()->json(['status' => 'success']);
    }
}

