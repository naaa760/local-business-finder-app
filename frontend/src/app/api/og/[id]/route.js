import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(request, { params }) {
  const id = params.id;

  try {
    // Fetch business data
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/external/places/${id}`
    );
    const business = await response.json();

    // Generate the OG image
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "20px",
              color: "#1a202c",
            }}
          >
            {business.name}
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#4a5568",
              marginBottom: "10px",
              maxWidth: "80%",
              textAlign: "center",
            }}
          >
            {business.category}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#718096",
              maxWidth: "80%",
              textAlign: "center",
            }}
          >
            {business.address}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.log(`Error generating OG image: ${e.message}`);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
