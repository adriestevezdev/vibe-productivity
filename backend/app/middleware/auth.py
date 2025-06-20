import httpx
from fastapi import HTTPException, Request, status
from jose import jwt, JWTError
from typing import Optional

from app.core.config import settings


CLERK_JWKS_URL = "https://api.clerk.com/v1/jwks"


class ClerkAuth:
    def __init__(self):
        self.jwks_client = None
        self._jwks = None
    
    async def get_jwks(self):
        if not self._jwks:
            async with httpx.AsyncClient() as client:
                response = await client.get(CLERK_JWKS_URL)
                response.raise_for_status()
                self._jwks = response.json()
        return self._jwks
    
    async def verify_token(self, token: str) -> dict:
        try:
            # Decode token header to get kid
            unverified_header = jwt.get_unverified_header(token)
            kid = unverified_header.get("kid")
            
            if not kid:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token missing kid in header"
                )
            
            # Get JWKS
            jwks = await self.get_jwks()
            
            # Find the key
            key = None
            for jwk in jwks.get("keys", []):
                if jwk.get("kid") == kid:
                    key = jwk
                    break
            
            if not key:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Unable to find matching key"
                )
            
            # Verify and decode token
            payload = jwt.decode(
                token,
                key,
                algorithms=["RS256"],
                options={"verify_aud": False}
            )
            
            return payload
            
        except JWTError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token validation failed: {str(e)}"
            )


clerk_auth = ClerkAuth()


async def get_current_user(request: Request) -> dict:
    authorization = request.headers.get("Authorization")
    
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )
    
    token = authorization.replace("Bearer ", "")
    
    user_data = await clerk_auth.verify_token(token)
    
    return {
        "user_id": user_data.get("sub"),
        "email": user_data.get("email"),
        "metadata": user_data.get("metadata", {})
    }