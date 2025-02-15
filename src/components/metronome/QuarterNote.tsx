interface Props {
  styleClass: string;
}

export default function QuarterNote({ styleClass }: Props) {
  return (
    <svg
      className={styleClass}
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      // xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 290.281 290.281"
      // xml:space="preserve"
    >
      <path
        id="XMLID_958_"
        d="M205.367,0h-30v173.646c-6.239-2.566-13.111-3.922-20.305-3.922c-17.458,0-35.266,7.796-48.857,21.388
			c-25.344,25.343-28.516,63.407-7.072,84.853c9.232,9.232,22.016,14.316,35.995,14.316c17.458,0,35.266-7.796,48.857-21.388
			c11.843-11.843,19.308-26.842,21.018-42.234c0.244-2.198,0.355-4.38,0.355-6.537h0.01V0z"
      />
    </svg>
  );
}
