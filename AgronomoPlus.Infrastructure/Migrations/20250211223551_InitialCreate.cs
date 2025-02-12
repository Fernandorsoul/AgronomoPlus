using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgronomoPlus.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "People",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UltimoAcesso = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_People", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Propriedades",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PersonId = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "text", nullable: false),
                    Localizacao = table.Column<string>(type: "text", nullable: false),
                    TamanhoArea = table.Column<decimal>(type: "numeric", nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Propriedades", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Propriedades_People_PersonId",
                        column: x => x.PersonId,
                        principalTable: "People",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Analises",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PropriedadeId = table.Column<Guid>(type: "uuid", nullable: false),
                    DataAnalise = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PH = table.Column<decimal>(type: "numeric", nullable: false),
                    MateriaOrganica = table.Column<decimal>(type: "numeric", nullable: false),
                    Nitrogenio = table.Column<decimal>(type: "numeric", nullable: false),
                    Fosforo = table.Column<decimal>(type: "numeric", nullable: false),
                    Potassio = table.Column<decimal>(type: "numeric", nullable: false),
                    Calcio = table.Column<decimal>(type: "numeric", nullable: false),
                    Magnesio = table.Column<decimal>(type: "numeric", nullable: false),
                    Enxofre = table.Column<decimal>(type: "numeric", nullable: false),
                    Aluminio = table.Column<decimal>(type: "numeric", nullable: false),
                    Recomendacoes = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Analises", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Analises_Propriedades_PropriedadeId",
                        column: x => x.PropriedadeId,
                        principalTable: "Propriedades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Financeiros",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PropriedadeId = table.Column<Guid>(type: "uuid", nullable: false),
                    TipoTransacao = table.Column<string>(type: "text", nullable: false),
                    Descricao = table.Column<string>(type: "text", nullable: false),
                    Valor = table.Column<decimal>(type: "numeric", nullable: false),
                    DataTransacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Financeiros", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Financeiros_Propriedades_PropriedadeId",
                        column: x => x.PropriedadeId,
                        principalTable: "Propriedades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Plantios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PropriedadeId = table.Column<Guid>(type: "uuid", nullable: false),
                    TipoSemente = table.Column<string>(type: "text", nullable: false),
                    TipoSolo = table.Column<string>(type: "text", nullable: false),
                    CorrecaoSolo = table.Column<string>(type: "text", nullable: false),
                    Adubacao = table.Column<string>(type: "text", nullable: false),
                    TempoCrecimento = table.Column<int>(type: "integer", nullable: false),
                    PrevisaoColheita = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Plantios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Plantios_Propriedades_PropriedadeId",
                        column: x => x.PropriedadeId,
                        principalTable: "Propriedades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ControlePragas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PlantioId = table.Column<Guid>(type: "uuid", nullable: false),
                    TipoPragaOuDoenca = table.Column<string>(type: "text", nullable: false),
                    Descricao = table.Column<string>(type: "text", nullable: false),
                    AcoesDeControle = table.Column<string>(type: "text", nullable: false),
                    DataRegistro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ControlePragas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ControlePragas_Plantios_PlantioId",
                        column: x => x.PlantioId,
                        principalTable: "Plantios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Analises_PropriedadeId",
                table: "Analises",
                column: "PropriedadeId");

            migrationBuilder.CreateIndex(
                name: "IX_ControlePragas_PlantioId",
                table: "ControlePragas",
                column: "PlantioId");

            migrationBuilder.CreateIndex(
                name: "IX_Financeiros_PropriedadeId",
                table: "Financeiros",
                column: "PropriedadeId");

            migrationBuilder.CreateIndex(
                name: "IX_Plantios_PropriedadeId",
                table: "Plantios",
                column: "PropriedadeId");

            migrationBuilder.CreateIndex(
                name: "IX_Propriedades_PersonId",
                table: "Propriedades",
                column: "PersonId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Analises");

            migrationBuilder.DropTable(
                name: "ControlePragas");

            migrationBuilder.DropTable(
                name: "Financeiros");

            migrationBuilder.DropTable(
                name: "Plantios");

            migrationBuilder.DropTable(
                name: "Propriedades");

            migrationBuilder.DropTable(
                name: "People");
        }
    }
}
