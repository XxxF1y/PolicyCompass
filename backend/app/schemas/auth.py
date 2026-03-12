from typing import Literal

from pydantic import BaseModel, field_validator


class LoginRequest(BaseModel):
    phone: str
    password: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        if len(v) != 11 or not v.isdigit():
            raise ValueError("手机号必须为11位数字")
        return v


class RegisterRequest(BaseModel):
    phone: str
    password: str
    role: Literal["talent", "tech_enterprise", "transform_enterprise", "park"]
    code: str | None = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        if len(v) != 11 or not v.isdigit():
            raise ValueError("手机号必须为11位数字")
        return v


class UserInfo(BaseModel):
    id: str
    phone: str
    role: str
    status: str

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserInfo


class PasswordResetRequest(BaseModel):
    phone: str
    code: str
    new_password: str
