import type { Room } from "../data/rooms";

type RoomBannerProps = {
  room: Room;
};

/** 画面上部に「今どこで何をしているか」を示す場所バナー */
export function RoomBanner({ room }: RoomBannerProps) {
  return (
    <div className="room-banner" style={{ ["--room-accent" as string]: room.accent }}>
      <div className="room-banner-left">
        <span className="room-banner-icon">{room.icon}</span>
        <div className="room-banner-text">
          <span className="room-banner-time">{room.time}</span>
          <strong className="room-banner-name">{room.name}</strong>
        </div>
      </div>
      <p className="room-banner-doing">{room.doing}</p>
    </div>
  );
}
