import ShareLayout from '../../components/shareLayout';

import { getAllShareIds, getShareData } from '../../lib/share';

export async function getStaticProps({ params }) {
  const shareData = getShareData(params.id);
  return {
    props: {
      shareData,
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllShareIds();
  return {
    paths,
    fallback: false,
  };
}

export default function Share({ shareData }) {
   return (
     <ShareLayout>
       {shareData.title}
       <br />
       {shareData.id}
       <br />
       {shareData.date}
     </ShareLayout>
   );
 }