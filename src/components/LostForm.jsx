import { goBackOnForm, submitLostForm } from "../actions";
import { useDispatch, useSelector } from "react-redux";

import { selectFormData } from "../selector";
import { setFormDataField } from "../actions";
import styled from "styled-components";

function LostForm() {
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
    <FormContainer>
      <BackButton
        onClick={() => {
          // @ts-ignore
          dispatch(goBackOnForm());
        }}
      >
        &#8592; 뒤로
      </BackButton>
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
      {photos.map((base64, index) => (
        <img
          key={index}
          src={base64}
          alt={`Uploaded Preview ${index}`}
          style={{ width: "200px", height: "200px", marginBottom: "10px" }}
        />
      ))}
      <ImageUploadLabel htmlFor="imageUpload">이미지 업로드</ImageUploadLabel>
      <input
        type="file"
        id="imageUpload"
        style={{ display: "none" }}
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />
      <SubmitButton
        onClick={() =>
          dispatch(
            // @ts-ignore
            submitLostForm()
          )
        }
      >
        등록하기
      </SubmitButton>
    </FormContainer>
  );
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-width: 300px;
  margin: 0 auto;
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

const SubmitButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  width: 100%;
`;

export default LostForm;
