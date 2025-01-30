import { api } from "~/trpc/react";
import {
  type MetabaseIFrameNumber,
  type MetabaseIframeType,
} from "~/types/enums/metabase";

interface MetabaseIframeProps {
  iframeNumber: MetabaseIFrameNumber;
  iframeType: MetabaseIframeType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>;
  width?: string;
  height?: string;
}
const MetabaseIframe: React.FC<MetabaseIframeProps> = ({
  iframeNumber,
  iframeType,
  params,
  width = "100%",
  height = "800px",
}) => {
  const [metabseIframeUrl] = api.metabase.getIframeUrl.useSuspenseQuery({
    iframeNumber,
    iframeType,
    params,
  });

  if (!metabseIframeUrl) {
    return "Loading...";
  }

  return <iframe src={metabseIframeUrl} width={width} height={height} />;
};

export default MetabaseIframe;
