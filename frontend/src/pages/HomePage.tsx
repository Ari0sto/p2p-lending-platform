import "./MarketplacePage.css";
import PlatformOverview from "../components/PlatformOverview";
import footerImage from "../assets/images/fut.png";

function HomePage() {
  return (
    <main className="home-page">
      <section className="home-dashboard-section">
        <div className="main-text-content">
          <h1>
            Інвестуйте в людей.
            <br />
            Підтримуйте можливості.
            <br />
            <span>Заробляйте разом.</span>
          </h1>

          <p>
            P2P-платформа, яка об&apos;єднує інвесторів
            та позичальників напряму. Прозоро, безпечно
            та вигідно для кожного.
          </p>
        </div>

        <PlatformOverview />
      </section>

      <section className="page-image-block footer-image-block">
        <img
          src={footerImage}
          alt="Безпека P2P платформи"
          className="wide-image"
        />
      </section>
    </main>
  );
}

export default HomePage;