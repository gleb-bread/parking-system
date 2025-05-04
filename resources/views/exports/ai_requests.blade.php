<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>AI Requests</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
    </style>
</head>
<body>
    <h2>AI Requests</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Time</th>
                <th>Upload Path</th>
            </tr>
        </thead>
        <tbody>
        @foreach ($requests as $req)
            <tr>
                <td>{{ $req->id }}</td>
                <td>{{ $req->status }}</td>
                <td>{{ $req->time }}</td>
                <td>{{ $req->upload->path ?? '-' }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
</body>
</html>
