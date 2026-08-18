import Hero from '../components/Hero';
import PopularTools from '../components/PopularTools';
import RecommendationSteps from '../components/RecommendationSteps';
import PopularReviews from '../components/PopularReviews';
import ContentHub from '../components/ContentHub';
import FAQ from '../components/FAQ';

export default function Home() {
  return (
    <>
      <Hero />
      <PopularTools />
      <RecommendationSteps />
      <PopularReviews />
      <ContentHub />
      <FAQ />
    </>
  );
}
