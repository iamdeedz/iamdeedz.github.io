import websockets
import asyncio
from json import loads, dumps


async def handle_location(msg, websocket):
    location = [msg["message"]["latitude"], msg["message"]["longitude"]]
    message = \
        {
            "type": "movement",
            "message": {
                "direction": 1,
                "distance": 150
            }
        }
    print(f"Location: {location}")
    await websocket.send(dumps(message))


async def handle_msg(msg, websocket):
    print(f"Received: {msg}")
    match msg["type"]:
        case "location":
            print("Location")
            await handle_location(msg, websocket)
        case "loading":
            print("Loading...")
        case "close":
            await websocket.close()
        case _:
            print(f"Unknown message type: {msg['type']}")
            await websocket.send(dumps({"type": "error", "message": "Unknown message type"}))


async def proxy(websocket):
    print("Connected")
    async for msg_json in websocket:
        msg = loads(msg_json)
        await handle_msg(msg, websocket)


async def main():
    async with websockets.serve(proxy, "127.0.0.1", 1300):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
