import { Col, Row, Card } from "antd";
import GettingStartingTopBar from "./GettingStartingTopBar";

function StartPage({ child }: { child?: React.ReactNode }) {
  return (
    <div className="w-full">
      <Row gutter={16} className="mt-0 !items-start">
        <Col className="gutter-row" span={12}>
          <div className="mt-10">
            <GettingStartingTopBar />
            <div dir="ltr">
              <div className="p-10 flex justify-center">{child}</div>
            </div>
          </div>
        </Col>

        <Col className="gutter-row" span={12}>
          <div className="p-6">
            <div className="space-y-6">
              {/* Image Placeholder */}
              <div className="flex items-center justify-center">
                <div className="w-full h-[400px] border-2 border-gray-400 flex items-center justify-center">
                  <span className="text-gray-500">Image Placeholder</span>
                </div>
              </div>

              {/* Bullet List Card */}
              <Card title="Text" className="rounded-md shadow-sm w-full">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    There are many variations of passages of Lorem Ipsum
                    available
                  </li>
                  <li>
                    There are many variations of passages of Lorem Ipsum
                    available
                  </li>
                  <li>
                    There are many variations of passages of Lorem Ipsum
                    available
                  </li>
                  <li>
                    There are many variations of passages of Lorem Ipsum
                    available
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default StartPage;
