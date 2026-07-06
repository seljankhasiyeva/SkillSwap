FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY SkillSwap.Domain/*.csproj SkillSwap.Domain/
COPY SkillSwap.Application/*.csproj SkillSwap.Application/
COPY SkillSwap.Infrastructure/*.csproj SkillSwap.Infrastructure/
COPY backend/*.csproj backend/
RUN dotnet restore backend/SkillSwap.API.csproj

COPY SkillSwap.Domain/ SkillSwap.Domain/
COPY SkillSwap.Application/ SkillSwap.Application/
COPY SkillSwap.Infrastructure/ SkillSwap.Infrastructure/
COPY backend/ backend/

RUN dotnet publish backend/SkillSwap.API.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "SkillSwap.API.dll"]cd