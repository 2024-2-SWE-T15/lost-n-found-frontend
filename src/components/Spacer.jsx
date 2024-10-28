import PropTypes from "prop-types";

export const Spacer = (props) => {
  const width =
    "width" in props ? props.width : "size" in props ? props.size : undefined;
  const height =
    "height" in props ? props.height : "size" in props ? props.size : undefined;

  // prevent squishing
  const style = {
    display: "flex",
    ...props.style,
    width,
    minWidth: width,
    maxWidth: width,
    height,
    minHeight: height,
    maxHeight: height,
  };

  return <div style={style} />;
};

Spacer.propTypes = {
  width: PropTypes.any,
  height: PropTypes.any,
  size: PropTypes.any,
  style: PropTypes.object,
};
