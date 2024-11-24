import { goBackOnForm, submitFoundForm } from "../actions";
import { useDispatch, useSelector } from "react-redux";

import { selectFormData } from "../selector";
import { setFormDataField } from "../actions";
import styled from "styled-components";

function FoundForm() {
  const dispatch = useDispatch();
  const {
    // @ts-ignore
    title = "",
    // @ts-ignore
    description = "",
    // @ts-ignore
    categories = "",
    // @ts-ignore
    phoneNumber = "",
    // @ts-ignore
    birthDate = "",
    // @ts-ignore
    photos = [],
  } = useSelector(selectFormData);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = [...photos];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPhotos.push(reader.result);
        dispatch(
          setFormDataField({
            field: "photos",
            value: [...newPhotos],
          })
        );
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <Container>
      <BackButton
        onClick={() => {
          // @ts-ignore
          dispatch(goBackOnForm());
        }}
      >
        &#8592; 뒤로
      </BackButton>
      <Title>발견한 물건의 정보를 입력해주세요</Title>
      <Input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) =>
          dispatch(setFormDataField({ field: "title", value: e.target.value }))
        }
      />
      <Input
        type="text"
        placeholder="상세"
        value={description}
        onChange={(e) =>
          dispatch(
            setFormDataField({ field: "description", value: e.target.value })
          )
        }
      />
      <Input
        type="text"
        placeholder="카테고리"
        value={categories}
        onChange={(e) =>
          dispatch(
            setFormDataField({ field: "categories", value: e.target.value })
          )
        }
      />
      <Input
        type="tel"
        placeholder="전화번호 (선택사항)"
        value={phoneNumber}
        onChange={(e) =>
          dispatch(
            setFormDataField({ field: "phoneNumber", value: e.target.value })
          )
        }
      />
      <Input
        type="date"
        placeholder="생년월일 (선택사항)"
        value={birthDate}
        onChange={(e) =>
          dispatch(
            setFormDataField({ field: "birthDate", value: e.target.value })
          )
        }
      />
      <HiddenFileInput
        type="file"
        id="imageUpload"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />
      {photos.map((photo, index) => (
        <ImagePreview
          key={index}
          src={photo}
          alt={`Uploaded Preview ${index}`}
        />
      ))}
      <ImageUploadLabel htmlFor="imageUpload">이미지 업로드</ImageUploadLabel>
      <SubmitButton
        onClick={() => {
          // @ts-ignore
          dispatch(submitFoundForm());
        }}
      >
        등록하기
      </SubmitButton>
    </Container>
  );
}

export default FoundForm;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  gap: 10px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  color: #333;
  font-size: 16px;
  cursor: pointer;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const ImageUploadLabel = styled.label`
  display: inline-block;
  padding: 10px;
  background-color: #d4f4d4;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  width: 100%;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImagePreview = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  width: 100%;
`;
