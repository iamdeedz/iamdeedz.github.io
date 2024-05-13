import websockets
import asyncio


async def proxy(websocket):
    print("Connected")
    async for msg in websocket:
        print(msg)


async def main():
    async with websockets.serve(proxy, "127.0.0.1", 1300):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
