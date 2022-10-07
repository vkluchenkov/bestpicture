interface DownloadProps {
  url: string;
}

export const Download: React.FC<DownloadProps> = ({ url }) => {
  const iframe = document.querySelector('#iframe') as HTMLIFrameElement | null;

  if (iframe) {
    iframe.contentWindow!.document.querySelector('body')!.style.backgroundColor = 'blue';
  }
  return <iframe src={url} width='300' height='300' frameBorder={0} id='iframe' />;
};
