{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
	buildInputs = with pkgs; [
		deno
		comrak
	];

	DENO_NO_UPDATE_CHECK = "1";
}
