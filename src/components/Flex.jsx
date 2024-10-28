import styled, { css } from "styled-components";

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const CenteredCss = css`
  justify-content: center;
  align-items: center;
`;

export const CenteredRow = styled(Row)`
  ${CenteredCss}
`;

export const CenteredColumn = styled(Column)`
  ${CenteredCss}
`;
