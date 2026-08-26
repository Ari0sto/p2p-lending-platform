import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./PlatformOverview.css";

const chartData = [
  { label: "Лют", value: 180000 },
  { label: "Бер", value: 310000 },
  { label: "Кві", value: 490000 },
  { label: "Тра", value: 680000 },
  { label: "Чер", value: 920000 },
  { label: "Лип", value: 1250000 },
];

function PlatformOverview() {
  const { user } = useAuth();

  const maxValue = Math.max(
    ...chartData.map((item) => item.value)
  );

  const points = chartData.map((item, index) => {
    const width = 760;
    const height = 180;

    const x =
      (index / (chartData.length - 1)) * width;

    const y =
      height - (item.value / maxValue) * 150;

    return {
      ...item,
      x,
      y,
    };
  });

  const polylinePoints = points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  return (
    <div className="platform-overview">
      <div className="platform-heading">
        <div>
         
         

          <h2>Платформа в цифрах</h2>
        </div>

        <span className="demo-label">
          
        </span>
      </div>

      <div className="platform-stats">
        <div className="platform-stat">
          <span>Інвесторів</span>
          <strong>128</strong>
          <small>на платформі</small>
        </div>

        <div className="platform-stat">
          <span>Активні заявки</span>
          <strong>24</strong>
          <small>доступні зараз</small>
        </div>

        <div className="platform-stat">
          <span>Профінансовано</span>
          <strong className="green-value">
            1,25 млн ₴
          </strong>
          <small>загальний обсяг</small>
        </div>

        <div className="platform-stat">
          <span>Середня ставка</span>
          <strong className="purple-value">
            14,8%
          </strong>
          <small>за заявками</small>
        </div>
      </div>

      <div className="platform-chart-card">
        <div className="platform-chart-title">
          <div>
            <span>ДИНАМІКА</span>
            <h3>Динаміка фінансування</h3>
          </div>

          <strong>1,25 млн ₴</strong>
        </div>

        <div className="real-chart">
          <svg
            viewBox="0 0 760 200"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="platformArea"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#755bff"
                  stopOpacity="0.45"
                />

                <stop
                  offset="100%"
                  stopColor="#755bff"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            <line
              x1="0"
              y1="40"
              x2="760"
              y2="40"
              className="platform-grid-line"
            />

            <line
              x1="0"
              y1="90"
              x2="760"
              y2="90"
              className="platform-grid-line"
            />

            <line
              x1="0"
              y1="140"
              x2="760"
              y2="140"
              className="platform-grid-line"
            />

            <polygon
              points={`0,190 ${polylinePoints} 760,190`}
              fill="url(#platformArea)"
            />

            <polyline
              points={polylinePoints}
              className="platform-chart-line"
            />

            {points.map((point) => (
              <circle
                key={point.label}
                cx={point.x}
                cy={point.y}
                r="6"
                className="platform-chart-point"
              />
            ))}
          </svg>

          <div className="chart-labels">
            {chartData.map((item) => (
              <span key={item.label}>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="home-role-cards">
        <div className="home-role-card investor-home-card">
          <div className="home-role-title">
            <div className="home-role-icon">
              ↗
            </div>

            <div>
              <span>МОЖЛИВОСТІ</span>
              <h3>Для інвестора</h3>
            </div>
          </div>

          <p className="home-role-description">
            Інвестуйте у кредитні заявки та
            отримуйте прибуток після їх погашення.
          </p>

          <div className="home-role-list">
            <p>✓ Перегляд доступних заявок</p>
            <p>✓ Вибір суми інвестиції</p>
            <p>✓ Отримання вкладених коштів і прибутку</p>
          </div>

          {user?.role === "INVESTOR" ? (
            <Link
              to="/marketplace"
              className="home-role-button investor-role-button"
            >
              Перейти до маркетплейсу
              <span>→</span>
            </Link>
          ) : !user ? (
            <Link
              to="/register"
              className="home-role-button investor-role-button"
            >
              Почати інвестувати
              <span>→</span>
            </Link>
          ) : (
            <div className="home-role-disabled">
              Доступно для Investor
            </div>
          )}
        </div>

        <div className="home-role-card borrower-home-card">
          <div className="home-role-title">
            <div className="home-role-icon">
              ₴
            </div>

            <div>
              <span>ФІНАНСУВАННЯ</span>
              <h3>Для позичальника</h3>
            </div>
          </div>

          <p className="home-role-description">
            Створюйте заявку та отримуйте
            фінансування напряму від інвесторів.
          </p>

          <div className="home-role-list">
            <p>✓ Створення кредитної заявки</p>
            <p>✓ Отримання фінансування</p>
            <p>✓ Контроль кредиту та погашення</p>
          </div>

          {user?.role === "BORROWER" ? (
            <Link
              to="/create-loan"
              className="home-role-button borrower-role-button"
            >
              Створити заявку
              <span>→</span>
            </Link>
          ) : !user ? (
            <Link
              to="/register"
              className="home-role-button borrower-role-button"
            >
              Отримати фінансування
              <span>→</span>
            </Link>
          ) : (
            <div className="home-role-disabled">
              Доступно для Borrower
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlatformOverview;