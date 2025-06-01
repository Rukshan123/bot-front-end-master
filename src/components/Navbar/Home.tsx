import { Card } from "antd";

function Home() {
  return (
    <div className="p-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Paragraph Card */}
            <Card title="Text" className="rounded-md shadow-sm">
              <p className="text-gray-700">
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old. Richard McClintock, a
                Latin professor at Hampden-Sydney College in Virginia, looked up
                one of the more obscure Latin words, consectetur, from a Lorem
                Ipsum passage, and going through the cites of the word in
                classical literature, discovered the undoubtable source. Lorem
                Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus
                Bonorum et Malorum" (The Extremes of Good and Evil).
              </p>
            </Card>

            {/* Bullet List Card */}
            <Card title="Text" className="rounded-md shadow-sm">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  There are many variations of passages of Lorem Ipsum available
                </li>
                <li>
                  There are many variations of passages of Lorem Ipsum available
                </li>
                <li>
                  There are many variations of passages of Lorem Ipsum available
                </li>
                <li>
                  There are many variations of passages of Lorem Ipsum available
                </li>
              </ul>
            </Card>
          </div>

          {/* Right Column - Image Placeholder */}
          <div className="flex items-center justify-center">
            <div className="w-full h-[400px] border-2 border-gray-400 flex items-center justify-center">
              <span className="text-gray-500">Image Placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
