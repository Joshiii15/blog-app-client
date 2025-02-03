const ArtPattern = () => {
  return (
    <div className="pattern-container">
      {[...Array(25)].map((_, i) => (
        <div key={i} className="pattern-box"></div>
      ))}

      <style>{`
        .pattern-container {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          width: 100%;
          max-width: 400px;
          margin: auto;
          padding: 20px;
        }

        .pattern-box {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg,rgb(40, 34, 91),rgb(77, 105, 133));
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease-in-out;
        }

        .pattern-box:hover {
          transform: scale(1.1);
        }

        @media (max-width: 600px) {
          .pattern-container {
            grid-template-columns: repeat(3, 1fr);
          }
          .pattern-box {
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </div>
  );
};

export default ArtPattern;
