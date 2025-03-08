const ListIcon = ({className}:{className: string}) => {
  return (
    <svg
      width="21"
      height="28"
      viewBox="0 0 21 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.75 0C9.28587 0 8.84075 0.184374 8.51256 0.512563C8.18437 0.840752 8 1.28587 8 1.75C8 2.21413 8.18437 2.65925 8.51256 2.98744C8.84075 3.31563 9.28587 3.5 9.75 3.5H13.25C13.7141 3.5 14.1592 3.31563 14.4874 2.98744C14.8156 2.65925 15 2.21413 15 1.75C15 1.28587 14.8156 0.840752 14.4874 0.512563C14.1592 0.184374 13.7141 0 13.25 0H9.75Z"
        fill={className}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 5.25C0 4.32174 0.368749 3.4315 1.02513 2.77513C1.6815 2.11875 2.57174 1.75 3.5 1.75C3.5 3.14239 4.05312 4.47774 5.03769 5.46231C6.02226 6.44688 7.35761 7 8.75 7H12.25C13.6424 7 14.9777 6.44688 15.9623 5.46231C16.9469 4.47774 17.5 3.14239 17.5 1.75C18.4283 1.75 19.3185 2.11875 19.9749 2.77513C20.6313 3.4315 21 4.32174 21 5.25V24.5C21 25.4283 20.6313 26.3185 19.9749 26.9749C19.3185 27.6313 18.4283 28 17.5 28H3.5C2.57174 28 1.6815 27.6313 1.02513 26.9749C0.368749 26.3185 0 25.4283 0 24.5V5.25ZM5.25 12.25C4.78587 12.25 4.34075 12.4344 4.01256 12.7626C3.68437 13.0908 3.5 13.5359 3.5 14C3.5 14.4641 3.68437 14.9092 4.01256 15.2374C4.34075 15.5656 4.78587 15.75 5.25 15.75H5.2675C5.73163 15.75 6.17675 15.5656 6.50494 15.2374C6.83313 14.9092 7.0175 14.4641 7.0175 14C7.0175 13.5359 6.83313 13.0908 6.50494 12.7626C6.17675 12.4344 5.73163 12.25 5.2675 12.25H5.25ZM10.5 12.25C10.0359 12.25 9.59075 12.4344 9.26256 12.7626C8.93437 13.0908 8.75 13.5359 8.75 14C8.75 14.4641 8.93437 14.9092 9.26256 15.2374C9.59075 15.5656 10.0359 15.75 10.5 15.75H15.75C16.2141 15.75 16.6592 15.5656 16.9874 15.2374C17.3156 14.9092 17.5 14.4641 17.5 14C17.5 13.5359 17.3156 13.0908 16.9874 12.7626C16.6592 12.4344 16.2141 12.25 15.75 12.25H10.5ZM5.25 19.25C4.78587 19.25 4.34075 19.4344 4.01256 19.7626C3.68437 20.0908 3.5 20.5359 3.5 21C3.5 21.4641 3.68437 21.9092 4.01256 22.2374C4.34075 22.5656 4.78587 22.75 5.25 22.75H5.2675C5.73163 22.75 6.17675 22.5656 6.50494 22.2374C6.83313 21.9092 7.0175 21.4641 7.0175 21C7.0175 20.5359 6.83313 20.0908 6.50494 19.7626C6.17675 19.4344 5.73163 19.25 5.2675 19.25H5.25ZM10.5 19.25C10.0359 19.25 9.59075 19.4344 9.26256 19.7626C8.93437 20.0908 8.75 20.5359 8.75 21C8.75 21.4641 8.93437 21.9092 9.26256 22.2374C9.59075 22.5656 10.0359 22.75 10.5 22.75H15.75C16.2141 22.75 16.6592 22.5656 16.9874 22.2374C17.3156 21.9092 17.5 21.4641 17.5 21C17.5 20.5359 17.3156 20.0908 16.9874 19.7626C16.6592 19.4344 16.2141 19.25 15.75 19.25H10.5Z"
        fill={className}
      />
    </svg>
  );
};

export default ListIcon;
