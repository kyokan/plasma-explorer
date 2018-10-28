export default function bemify(block) {
  return (element, modifier) => {
    if (element && modifier) {
      return `${block}__${element}--${modifier}`;
    }

    if (element) {
      return `${block}__${element}`;
    }

    if (modifier) {
      return `${block}--${modifier}`;
    }

    return block;
  };
}