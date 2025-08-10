import React from "react";

const PokemonCard = ({ pokemon, toggleCollection, isInCollection }) => {
  const { name, sprites, types, stats } = pokemon;
  const imageUrl = sprites?.other?.["official-artwork"]?.front_default;


  const hp = stats?.hp ?? 0;
  const attack = stats?.attack ?? 0;
  const defense = stats?.defense ?? 0;

  return (
    <div style={styles.card}>
      <button style={styles.button(isInCollection)} onClick={() => toggleCollection(pokemon)}>
        {isInCollection ? "✕" : "+"}
      </button>

      <div style={styles.iconWrapper}>
        <img src={imageUrl} alt={name} style={{ width: "70px", height: "70px" }} />
      </div>

      <h3 style={styles.name}>{name.charAt(0).toUpperCase() + name.slice(1)}</h3>

      <div style={styles.types}>
        {types.map(({ type }) => (
          <span key={type.name} style={styles.typeBadge(type.name)}>
            {type.name.toUpperCase()}
          </span>
        ))}
      </div>

      <div style={styles.stats}>
        <div>
          <strong style={styles.hp}>{hp}</strong>
          <div>HP</div>
        </div>
        <div>
          <strong style={styles.attack}>{attack}</strong>
          <div>Attack</div>
        </div>
        <div>
          <strong style={styles.defense}>{defense}</strong>
          <div>Defense</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "20px",
    width: "260px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    position: "relative",
    textAlign: "center",
    boxSizing: "border-box",
  },
  iconWrapper: {
    background: "linear-gradient(135deg, #f77062, #fe5196)",
    borderRadius: "50%",
    padding: "15px",
    width: "90px",
    height: "90px",
    margin: "0 auto 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  button: (isInCollection) => ({
    backgroundColor: isInCollection ? "#f44336" : "#4caf50",
    color: "#fff",
    fontSize: "18px",
    border: "none",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    cursor: "pointer",
    position: "absolute",
    top: "12px",
    right: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  }),
  name: {
    fontSize: "20px",
    fontWeight: "bold",
    textTransform: "capitalize",
    marginBottom: "10px",
  },
  types: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "15px",
  },
  typeBadge: (type) => ({
    backgroundColor:
      type === "fire"
        ? "#ff6b6b"
        : type === "water"
        ? "#6bafff"
        : type === "grass"
        ? "#4caf50"
        : "#b0b0b0",
    color: "#fff",
    fontWeight: "bold",
    padding: "5px 10px",
    borderRadius: "12px",
    fontSize: "12px",
  }),
  stats: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "10px",
    fontSize: "14px",
  },
  hp: { color: "#7575f5", fontSize: "18px" },
  attack: { color: "#4a4aff", fontSize: "18px" },
  defense: { color: "#7575f5", fontSize: "18px" },
};

export default PokemonCard;
